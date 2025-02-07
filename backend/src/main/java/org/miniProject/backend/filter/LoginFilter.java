package org.miniProject.backend.filter;

import java.io.IOException;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import lombok.extern.slf4j.Slf4j;
import org.miniProject.backend.auth.CustomUserDetails;
import org.miniProject.backend.global.ApiResponse;
import org.miniProject.backend.global.ErrorResponse;
import org.miniProject.backend.utils.JWTUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter{

	private final AuthenticationManager authenticationManager;
	private final JWTUtil jwtUtil;
	
	public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
		System.out.println("LoginFilter 생성됨.....");
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
		try {
			response.setCharacterEncoding("UTF-8");
			String body = request.getReader().lines().reduce("", (accumulator, actual) -> accumulator + actual);

			ObjectMapper objectMapper = new ObjectMapper();
			Map<String, String> jsonRequest = objectMapper.readValue(body, Map.class);

			String username = jsonRequest.get("username");
			String password = jsonRequest.get("password");
			String userType = jsonRequest.get("userType");

			System.out.println(username+"-------------------"+password);

			if (username == null || password == null || userType == null) {
				throw new RuntimeException("Username, Password 또는 UserType이 비었음");
			}

			log.info("username : {} , password  : {} , userType , {} " , username, password, userType);

			UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);
			Authentication authentication = authenticationManager.authenticate(authToken);

			CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
			String role = userDetails.getAuthorities().iterator().next().getAuthority();

			if ((userType.equals("USER_OR_ADMIN") && !(role.equals("ROLE_USER") || role.equals("ROLE_ADMIN"))) ||
					(userType.equals("MANAGER") && !role.equals("ROLE_MANAGER"))) {
				throw new RuntimeException("잘못된 사용자 유형입니다.");
			}

			return authentication;

		} catch (IOException e) {
			throw new RuntimeException("파싱 오류 ", e);
		}
	}


	/**
	 * 로그인 성공 처리
	 */
	@Override
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
		log.info("로그인 성공이요");

		CustomUserDetails userDetails = (CustomUserDetails) authResult.getPrincipal();
		String username = userDetails.getUsername();
		String role = userDetails.getAuthorities().iterator().next().getAuthority();
		String name = userDetails.getName();

		String token = jwtUtil.createJwt(username, role, name, 60 * 60 * 24 * 1000L);


		Cookie cookie = new Cookie("Authorization", token);
		cookie.setPath("/");
		cookie.setMaxAge(60 * 60 * 24);
		response.addCookie(cookie);


		log.info("JWT 쿠키 설정 완료: {}", token);
		Map<String, String> userInfo = Map.of("username", username, "role", role, "name", name);
		ApiResponse<Map<String, String>> apiResponse = new ApiResponse<>(
				ApiResponse.ApiStatus.SUCCESS,
				userInfo,
				false
		);


		ObjectMapper objectMapper = new ObjectMapper();
		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().write(objectMapper.writeValueAsString(apiResponse));

		log.info("로그인 성공: username={}, role={}", username, role);
	}

	/**
	 * 로그인 실패 처리
	 */
	@Override
	protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {

		// 로그인 실패 로그 상세히 기록
		log.error("로그인 실패: 원인 메시지 - {}", failed.getMessage(), failed); // 스택 트레이스 포함
		log.error("로그인 실패: 인증 예외 클래스 - {}", failed.getClass().getName());
		log.error("로그인 실패: 요청 URI - {}", request.getRequestURI());
		log.error("로그인 실패: 요청 IP - {}", request.getRemoteAddr());


		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

		ErrorResponse errorResponse = new ErrorResponse(null, "아이디 또는 비밀번호를 확인해주세요.", HttpStatus.UNAUTHORIZED);

		ApiResponse<ErrorResponse> apiResponse = new ApiResponse<>(
				ApiResponse.ApiStatus.ERROR,
				errorResponse,
				false
		);

		ObjectMapper objectMapper = new ObjectMapper();
		response.setContentType("application/json;charset=UTF-8");
		response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
	}
}