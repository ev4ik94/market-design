import crypto from "crypto";

export function getCookie(name){
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


export function createCookie(name, text){

    let data;
    if(typeof text==='string'){
        data = text;
    }else{
        data = JSON.stringify(text);
    }

    let date = new Date(Date.now() + 86400e3);
    date = date.toUTCString();

    document.cookie = name+"="+data+"; path=/; expires="+date;
}


export function eraseCookie(name) {
    document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

export function formatDate(date){
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth()+1)<10?`0${d.getMonth()+1}`:d.getMonth()+1;
    const day = d.getDate()<10?`0${d.getDate()}`:d.getDate();


    return `${day}.${month}.${year}`;
}

export function cdT(t){
    const alf1 = ['aFg1', 'uj8C', 'eVeg', '1h4F', 'ghTk'];
    const alf2 = ['bph4', 'GHol', '1fT3', 'jUik', 'vbSl'];
    let rnd = Math.floor(Math.random() * (4 - 0 + 1)) + 0;
    return `${alf1[rnd]}${t}${alf1[rnd]}`;
}

export function dcT(t){
    const alf1 = ['aFg1', 'uj8C', 'eVeg', '1h4F', 'ghTk'];
    const alf2 = ['bph4', 'GHol', '1fT3', 'jUik', 'vbSl'];
    let tok = t.substring(0, t.length - 4);
    tok = tok.substring(4);
    return tok;
}

export function encrypt(text){

    let dt;
    if(typeof text==='string'){
        dt = text;
    }else{
        dt = JSON.stringify(text)
    }

    const cipher = crypto.createCipher('aes128', '41f733');
    let encrypted = cipher.update(dt, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;


}

export function decrypt(text){

    if(text!==null && text){
        let dt = text?text.replace(/"/g, ''):'';
        const decipher = crypto.createDecipher('aes128','41f733');
        let decrypted = decipher.update(dt,'hex', 'utf8');
        decrypted += decipher.final('utf8');

        let response = JSON.parse(decrypted);

        return response;
    }


}

export const paginationCalc = (totalCount, count, fn)=>{
    const a = totalCount/count;
    let arrPag = [];
    for(let i=0; i<=a; i++){
        arrPag.push(i+1)
    }
    fn(arrPag);

}
