function validateDataChange() {
			const imie = document.getElementById('newName').value
			const nazwisko = document.getElementById('newLastName').value
			var RegImie = /^[A-ZĄĆĘŁŃÓŚŹŻ]{1}[a-ząćęłńóśźż]+$/;
			var RegNazw = /^([A-ZĄĆĘŁŃÓŚŹŻ]{1}[a-ząćęłńóśźż]+){1}(-{1}[A-ZĄĆĘŁŃÓŚŹŻ]{1}[a-ząćęłńóśźż]+){0,1}$/;
			if(!RegImie.test(imie))
			{
				alert("W imieniu występuje błąd. Upewnij się, że zaczyna się ono z dużej litery i nie ma żadnych spacji");
				return false;
			}
			else if(!RegNazw.test(nazwisko))
			{
				alert("W nazwisku występuje błąd. Upewnij sie, że zaczyna się ono z dużej litery, a jeśli jest podwójne, to sprawdź czy jest oddzielone myślnikiem (np. Kowalski-Kmicic)");
				return false;
			}
			return true;
}
function validatePassChange(){
			const haslo = document.getElementById('newPassword1').value
			const haslo2 = document.getElementById('newPassword2').value
			if(haslo.includes(' '))
			{
				alert("Haslo nie może mieć spacji");
				return false;
			}
			else if(haslo!=haslo2)
			{
				alert("Hasla sa różne");
				return false;
			}
			return true;
}
function validateLogin()
{
		const login = document.getElementById('login').value 
		if(login.includes(' '))
			{
				alert("Login nie może mieć spacji");
				return false;
			}
		return true;	
}
function validateTest()
{
	if(validateDataChange() && validateLogin() && validatePassChange() )
		return true;
	return false;
}