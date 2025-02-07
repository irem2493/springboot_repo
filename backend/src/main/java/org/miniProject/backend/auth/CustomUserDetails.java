package org.miniProject.backend.auth;

import java.util.ArrayList;
import java.util.Collection;

import org.miniProject.backend.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


public class CustomUserDetails implements UserDetails{

	private User user;
	
	public CustomUserDetails(User user) {	//생성자 주입
		this.user = user;
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		//상속받거나 구현한 구현체일 경우로 타입을 제한하고 있다.
		
		
		Collection<GrantedAuthority> collection = new ArrayList<>();
		collection.add(new GrantedAuthority() {
			
			private static final long serialVersionUID = 1L;

			@Override
			public String getAuthority() {
				return user.getRole();
			}
		});
		
		//return null 되어 있으면 안된다.
		return collection;
	}

	@Override
	public String getPassword() {
		return user.getPassword();
	}

	@Override
	public String getUsername() {
		return user.getUsername();
	}
	
	//부가적인 부분은 추가할 수 있다.
	public String getName() {
		return user.getName();
	}

	public String getBirth() {
		return user.getBirth();
	}

	public String getGender() {
		return user.getGender();
	}
	
	public String getRole() {
		return user.getRole();
	}
	
}
