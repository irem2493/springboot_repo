package org.miniProject.backend.auth;

import org.miniProject.backend.entity.User;
import org.miniProject.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class CustomUserDetailsService implements UserDetailsService{
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		//@Override이므로 함수 구조를 바꿀 수 없다.
		Optional<User> user = userRepository.findByUsername(username);
		if(user.isPresent()){
			User userEntity = user.get();
			return new CustomUserDetails(userEntity);
		}
		throw new UsernameNotFoundException("User not found");
	}
}
