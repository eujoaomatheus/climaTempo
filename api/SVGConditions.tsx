import axios from "axios";


const instance = axios.create({
    baseURL: 'https://assets.hgbrasil.com/weather/icons/conditions',
});


const ConditionsBackImages = { 
    getConditionsBackImages: async (condition_slug:any) => {
        try {
            const response = await instance.get(`/${condition_slug}.svg`);
            return response; // ou talvez apenas response, dependendo do formato esperado
        } catch (error) {
            console.error("Erro ao obter imagem:", error);
            throw error; // Rejeita a promessa com o erro
        }
    }
}

export default ConditionsBackImages;
