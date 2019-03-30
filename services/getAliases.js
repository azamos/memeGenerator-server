// module.exports = getAliases = (str) => {
// 	let aliases = [];
// 	for(let i = str.length-1; i >=0 ; i--){
// 		aliases.push(str.substr(0,str.length-i));
// 	}
// 	return aliases;
// }
module.exports = function getAliases(str,aliases=[],i=0){
	if(i<str.length){
		aliases.unshift(str.substr(0,str.length-i));
		setImmediate(getAliases,str,aliases,++i);
	}
	else{
		return aliases;
	}
}