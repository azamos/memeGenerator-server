// module.exports = getAliases = (str) => {
// 	let aliases = [];
// 	for(let i = str.length-1; i >=0 ; i--){
// 		aliases.push(str.substr(0,str.length-i));
// 	}
// 	return aliases;
// }
let aliases = [];
module.exports = getAliases = (str, i = str.length-1) => {
	if(i>=0){
        aliases.push(str.substr(0,str.length-i));
        setImmediate(getAliases,--i);
    }
	else{
        return aliases; 
    }
}