import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button,FlatList,Image,Modal,SafeAreaView,ScrollView,StyleSheet,Text, TextInput, TouchableOpacity, View } from 'react-native';
import chamaClima from './api/APIClima';
import ConditionsBackImages from './api/SVGConditions';
import { SvgXml } from 'react-native-svg';
import { AntDesign,Feather,Ionicons,SimpleLineIcons,MaterialCommunityIcons} from '@expo/vector-icons';


interface Forecast {
  max: string,
  min: string,
  condition: string,
  weekday:string,
}

interface ConditionImages {
  [key: string]: any; 
}

const conditionImages :ConditionImages =  {
  'storm': require('./assets/storm.png'),
  'snow': require('./assets/snow.png'),
  'rain': require('./assets/rain.png'),
  'none_night': require('./assets/none_night.png'),
  'none_day': require('./assets/none_day.png'),
  'hail': require('./assets/hail.png'),
  'fog': require('./assets/fog.png'),
  'cloudly_night': require('./assets/cloudly_night.png'),
  'cloudly_day': require('./assets/cloudly_day.png'),
  'cloud': require('./assets/cloud.png'),
  'clear_night': require('./assets/clear_night.png'),
  'clear_day': require('./assets/clear_day.png'),

};

export default function App() {
  const [list, setList] = useState([])
  const [temp, setTemp] = useState('')
  const [city, setCity] = useState('')
  const [description, setDescription] = useState('')
  const [time,setTime] = useState('')
  const [umidade,setUmidade] = useState('')
  const [vento,setVento] = useState('')
  const [chuva,setChuva] = useState('')
  const [max,setMax] = useState('')
  const [min,setMin] = useState('')
  const [date,setDate] = useState('')
  const [condition_slug ,setCondition_slug] = useState('')
  const [condition_slugImage ,setCondition_slugImage] = useState<string | null>(null);  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const options = ['Recife', 'Outro'];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [otherCity, setOtherCity] = useState('');
  const [isOtherCityModalOpen, setIsOtherCityModalOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option:any) => {
    setSelectedOption(option);
    if (option === 'Outro') {
      setIsOtherCityModalOpen(true);}
    else
    setIsOpen(false);
    carregarClima(option)
  };

  const handleOtherCityModalClose = () => {
    setIsOtherCityModalOpen(false);
    setOtherCity('');
  };

  const handleOtherCitySubmit = () => {
    carregarClima(city);
    setSelectedOption(city);
    setIsOtherCityModalOpen(false);
    setOtherCity('');
    setIsOpen(false)
  };

    const carregarClima = async (nomeCidade:any) => {
      try {
        const response = await chamaClima.pegarViaCidade(nomeCidade);
        const conditionImage = await ConditionsBackImages.getConditionsBackImages(response.data.results.condition_slug)
        setCondition_slugImage(conditionImage.data)
        setList(response.data.results.forecast.map((e:Forecast )=> ({
          'max': e.max,
          'min': e.min,
          'condition': e.condition,
          'weekday':e.weekday
        })));
        setTemp(response.data.results.temp);
        setCity(response.data.results.city);
        setTime(response.data.results.time);
        setDate(response.data.results.date);
        setMax(response.data.results.forecast[0].max)
        setMin(response.data.results.forecast[0].min)
        setChuva(response.data.results.forecast[0].rain_probability)
        setUmidade(response.data.results.humidity)
        setVento(response.data.results.forecast[0].wind_speedy)
        setCondition_slug(response.data.results.condition_slug);
      } catch (error) {
        console.warn(error);
      }
    }

  return (
    <View className='flex-1 flex-col  bg-blue-800 justify-center justify-items-center '>
    <View className='flex-0 flex-row justify-center mt-5'>
    <TouchableOpacity onPress={toggleDropdown}>
    <View>
      <Text className='text-white px-5 mt-9'>
        <Feather name="map-pin" size={15} color="white" />
        {selectedOption || 'Escolha uma cidade '}
        <AntDesign name="caretdown" size={15} style={{}} color="white" />
      </Text>
    </View>
  </TouchableOpacity>
  {isOpen && (
    <View style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 1 }}>
      {options.map((option, index) => (
        <TouchableOpacity className=' bg-blue-800 border-white'
          key={index}
          onPress={() => { handleOptionSelect(option); carregarClima(selectedOption) }}>
          <Text className='text-white px-5 mt-2 mb-2'>{option}</Text>
        </TouchableOpacity>
      ))}
        </View>
      )}
        <Modal
        visible={isOtherCityModalOpen}
        onRequestClose={handleOtherCityModalClose}
        transparent={true}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <TextInput
              placeholder="Cidade"
              
              onChangeText={setCity}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
              <Button title="Cancelar" onPress={handleOtherCityModalClose} />
              <Button title="Confirmar" onPress={handleOtherCitySubmit} />
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity className='pl-56 mt-9 mr-5'>
       <Ionicons name="notifications-outline" size={15} color="white" />   
       </TouchableOpacity>
       </View>
       <View className='flex-1 flex-col justify-top items-center mt-8 '>
       <TouchableOpacity><SvgXml  xml={condition_slugImage} /></TouchableOpacity>
       <Text className='text-white text-4xl font-bold'>{temp}º</Text>
       <Text className='text-white text-base font-normal'>Precipitações</Text>
       <Text className='text-white text-base font-normal'>Max.: {max} Min.: {min}</Text>
       <View className='flex-row'>
       <View style={{ backgroundColor: '#0D3987',borderTopLeftRadius: 20, borderBottomLeftRadius: 20, padding: 10, width: '30%', alignItems: 'center', justifyContent: 'center' }}>
        <Text className='text-white' ><SimpleLineIcons name="drop" size={15} color="white" /> {chuva} %</Text>
      </View>
      <View style={{ backgroundColor: '#0D3987', padding: 10, width: '30%', alignItems: 'center', justifyContent: 'center' }}>
        <Text className='text-white' ><Feather name="thermometer" size={15} color="white" />{umidade} %</Text>
      </View>
      <View style={{ backgroundColor: '#0D3987', borderTopRightRadius: 20, borderBottomRightRadius: 20, padding: 10, width: '30%', alignItems: 'center', justifyContent: 'center' }}>
        <Text className='text-white' ><MaterialCommunityIcons name="weather-windy" size={15} color="white" /> {vento}</Text>
      </View>
      </View>
      
      <View className='flex-row mt-5  '>
      <View style={{ backgroundColor: '#0D3987',borderTopLeftRadius: 20, borderBottomLeftRadius: 20,borderTopRightRadius: 20, borderBottomRightRadius: 20, padding: 10, width: '90%', alignItems: 'center', justifyContent: 'center' }}>
      
      <View className='flex-row  '>
       <Text className='text-white text-lg  '>Hoje                                                  </Text><Text className='text-white text-lg'>mar,{parseInt(date.substring(0,2))+selectedIndex}</Text> 
       </View>
       
       <ScrollView horizontal={true}> 
       <View className='flex-row'>
       <View className='flex-row'>
       {list.map((forecast: Forecast, index) => (
  <View 
    className={'top-1 items-center space-x-2 mx-2 '} 
    key={index}  
  >
    <TouchableOpacity   className={`top-1 items-center space-x-2  ${index === selectedIndex ? 'highlighted border border-white pr-2' : ''}`} 
          key={index} 
          style={{ marginBottom: 10 }}
          onPress={() => setSelectedIndex(index)} >
    <Text className={'text-white pl-2'}>{forecast.weekday}</Text>
    <Text className={'text-white'}>Max: {forecast.max}</Text>
    <Text className={'text-white'}>Min: {forecast.min}</Text>
    <Image 
      source={conditionImages[forecast.condition]} 
      style={{ width: 50, height: 50 }}
    />
    </TouchableOpacity>
  </View>
))}

    </View>
       </View>
       </ScrollView>
      </View>
        </View>
       </View>
       </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});