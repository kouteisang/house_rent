import axios from "axios";


export const getCurrentCity = ()=>{
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'));
    if(!localCity){
        return new Promise((resolve, reject)=>{
            try{
                const currentCity = new window.BMapGL.LocalCity();
                currentCity.get(async (res)=>{
                    const cityInfo = await axios.get('http://localhost:8080/area/info',{
                        params:{
                            name:res.name
                        }
                    })
                    localStorage.setItem('hkzf_city', JSON.stringify(cityInfo.data.body));
                    resolve(cityInfo.data.body);
                })
            }catch(e){
                reject(e)
            }
        })
    }else{
        return new Promise((resolve,reject)=>{
            resolve(localCity)
        });
    }    
}