function validateDataChange() {
			const imie = document.getElementById('newName').value
			const nazwisko = document.getElementById('newLastName').value
			var RegCheck=0
			var RegImie = /^[A-ZĄĆĘŁŃÓŚŹŻ]{1}[a-ząćęłńóśźż]+$/;
			var RegNazw = /^([A-ZĄĆĘŁŃÓŚŹŻ]{1}[a-ząćęłńóśźż]+){1}(-{1}[A-ZĄĆĘŁŃÓŚŹŻ]{1}[a-ząćęłńóśźż]+){0,1}$/;
			document.getElementById('ValidateImieInfo').innerHTML=''
			document.getElementById('ValidateNazwInfo').innerHTML=''
			document.getElementById('newName').style.backgroundColor=''
			document.getElementById('newLastName').style.backgroundColor=''
			if(!RegImie.test(imie))
			{
				document.getElementById('newName').style.backgroundColor = '#F26760';
				document.getElementById('ValidateImieInfo').innerHTML='W imieniu występuje błąd. Upewnij się, że zaczyna się ono z dużej litery i nie ma żadnych spacji';
				RegCheck=1
			}
			if(!RegNazw.test(nazwisko))
			{
				document.getElementById('newLastName').style.backgroundColor = '#F26760';
				document.getElementById('ValidateNazwInfo').innerHTML='W nazwisku występuje błąd. Upewnij sie, że zaczyna się ono z dużej litery, a jeśli jest podwójne, to sprawdź czy jest oddzielone myślnikiem (np. Kowalski-Kmicic)';
				RegCheck=1
			}
			if(RegCheck==0)
			return true;
			
			return false;
}
function validatePassChange(){
			const haslo = document.getElementById('newPassword1').value
			const haslo2 = document.getElementById('newPassword2').value
			var RegCheck=0
			document.getElementById('ValidatePassInfo').innerHTML=''
			document.getElementById('ValidatePass2Info').innerHTML=''	
			document.getElementById('newPassword1').style.backgroundColor=''
			document.getElementById('newPassword2').style.backgroundColor=''
			if(haslo.includes(' '))
			{
				document.getElementById('ValidatePassInfo').innerHTML='Haslo nie może mieć spacji';
				document.getElementById('newPassword1').style.backgroundColor='#F26760'
				RegCheck=1
			}
			if(haslo!=haslo2)
			{
				document.getElementById('ValidatePass2Info').innerHTML='Hasła są różne';
				document.getElementById('newPassword1').style.backgroundColor='#F26760'
				document.getElementById('newPassword2').style.backgroundColor='#F26760'
				RegCheck=1
			}
			if(RegCheck==0)
			return true;
			
			return false;
}
function validateLogin()
{
		document.getElementById('ValidateLoginInfo').innerHTML=''
		document.getElementById('login').style.backgroundColor=''
		const login = document.getElementById('login').value 
		if(login.includes(' '))
			{
				document.getElementById('ValidateLoginInfo').innerHTML='Login nie może mieć spacji';
				document.getElementById('login').style.backgroundColor='#F26760'
				return false;
			}
		return true;	
}
function validateRegister()
{
	var RegCheck=0
	if(!validateDataChange())
	RegCheck=1
	if(!validateLogin())
	RegCheck=1
	if(!validatePassChange())
	RegCheck=1

		if(RegCheck==0)
		return true;
			
		return false;
}