export const setCookie = (cookieName, cookieValue, expirationDay) => {
	let date = new Date();
	date.setTime(date.getTime() + expirationDay * 24 * 60 * 60 * 1000);
	let expires = "expires=" + date.toUTCString();
	document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
};

export const getCookie = (cookieName) => {
	let name = cookieName + "=";
	let cookieArray = document.cookie.split(";");
	for (let i = 0; i < cookieArray.length; i++) {
		let cookie = cookieArray[i];
		while (cookie.charAt(0) === " ") {
			cookie = cookie.substring(1);
		}
		if (cookie.indexOf(name) === 0) {
			return cookie.substring(name.length, cookie.length);
		}
	}
	return "";
};

export const deleteCookie = (name) => {
	document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};
