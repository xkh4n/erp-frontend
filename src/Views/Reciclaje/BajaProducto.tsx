import { IsEmail, IsPassword} from '../../Library/Validations'
import { CustomError } from '../../Library/Errores';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { TextBox } from "../../Components/Input";
import { personAddOutline } from 'ionicons/icons'
import { IonIcon } from '@ionic/react'

export default function BajaProducto() {
    const [producto, setProducto] = useState('');
    const [errorProducto, setErrorProducto] = useState(false);
    const [serie, setSerie] = useState('');
    const [errorSerie, setErrorSerie] = useState(false);
    const navigate = useNavigate();

    return (
        <div className='flex justify-center items-center'>
            <form>
                <div className="bg-white px-4 py-8 rounded-xl w-screen shadow-md max-w-sm">
                    <div className="space-y-4">
                        <h1 className="text-center text-2xl font-semibold text-blue-950">Reciclaje de Artículos TI</h1>
                        <div className='flex'>
                            <TextBox
                                    label="Producto"
                                    type="text"
                                    name="producto"
                                    placeholder="Artículo"
                                    error={errorProducto}
                                    value={producto}
                                    onChange={(e) => {
                                        setProducto(e.target.value)
                                        setErrorProducto(false)
                                    }}
                                    errorMessage="Por favor, ingrese un nombre válido"
                            />
                            <TextBox
                                    label="Serie"
                                    type="text"
                                    name="nroserie"
                                    placeholder="Nro. Serie"
                                    error={errorSerie}
                                    value={serie}
                                    onChange={(e) => {
                                        setSerie(e.target.value)
                                        setErrorSerie(false)
                                    }}
                                    errorMessage="Por favor, ingrese un nombre válido"
                            />
                        </div>
                    </div>
                    <button
                        className="flex justify-center items-center mt-4 w-full bg-blue-950 hover:bg-red-600 shadow-red-600/50 text-indigo-100 py-2 rounded-full text-lg tracking-wide hover:shadow-blue-800/50 transition delay-10 duration-300 ease-in-out hover:translate-y-1">
                            <IonIcon icon={personAddOutline} className="w-5 h-5"/>
                            <p className="ml-4 text-lg">Registro</p>
                    </button>
                </div>
            </form>
        </div>
    )
}
