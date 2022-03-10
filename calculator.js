var x = '';
function a (id) {
	return document.getElementById(id); 
}
function displayValue(value){
	x += value;
	a('screen').value = x;
}
function Delete(){
	x = '';
	a('screen').value = x;
}
function ketqua(){
	a('screen').value = eval(a('screen').value);
}