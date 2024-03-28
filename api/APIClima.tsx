import axios from "axios";

const CHAVE_API_HGBRASIL = ''; 

const instance = axios.create({
    baseURL: 'https://api.hgbrasil.com/weather',
    params: {
        key: CHAVE_API_HGBRASIL
    }
});

const chamaClima = {
    pegarViaCidade: (NomeCidade:string) => {
        return instance.get('', {
            params: {
                city_name: NomeCidade
            }
        });
    }
}

export default chamaClima;
