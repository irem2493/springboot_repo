package org.miniProject.backend.config;

import org.miniProject.backend.filter.JWTFilter;
import org.miniProject.backend.utils.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;



@Configuration
public class FilterConfig {

		@Autowired
		private JWTUtil jwtUtil;
		
		@Bean
		public FilterRegistrationBean<JWTFilter> jwtFilterRegistration(){
			FilterRegistrationBean<JWTFilter> resostrationBean = new FilterRegistrationBean<>();
			resostrationBean.setFilter(new JWTFilter(jwtUtil));
			resostrationBean.addUrlPatterns("/api/*");
			return resostrationBean;
			
		}
}
