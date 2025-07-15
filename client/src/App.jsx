import axios  from 'axios'
import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState(null)

  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_API_URL}/your-endpoint`)
     .then(response =>{
      setData(response.data)
     })
     .catch(error=>{
      console.error("Error fetching data.", error)
     })
  },[])

  return(
    <div>
      <h1>Jiseti</h1>
      <p>API says: {message}</p>
    </div>
  )

}

export default App
