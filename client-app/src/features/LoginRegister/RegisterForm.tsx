import { Form, Formik } from 'formik';
import { Button, Icon, Segment } from 'semantic-ui-react';
import * as Yup from 'yup';
import TextInput from '../../common/TextInput';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {

    const navigate = useNavigate();

    const validationSchema = Yup.object({
        ime : Yup.string().required("Unesite ime"),
        prezime : Yup.string().required("Unesite prezime"),
        email : Yup.string().required("Unesite email"),
        password : Yup.string().required("Unesite lozinku")
    })

    const handleSubmit = (values:any)=>{

    }

  return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
    }}>
<Segment color='blue' style={{width: "500px",
        padding: "3rem", 
        borderRadius: "10px", 
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"}}>
        <Formik
            initialValues={{
                ime : '',
                prezime: '',
                email: '',
                password: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values)=>handleSubmit(values)}
        >
            {({handleSubmit,isValid, dirty})=>(
                <Form className='ui form' onSubmit={handleSubmit}>
                    <TextInput name="ime" placeholder='Ime'/>
                    <TextInput name="prezime" placeholder='Prezime'/>
                    <TextInput name="email" placeholder='Email'/>
                    <TextInput name="password" placeholder='Lozinka'/>
                    <Button 
                        className='right floated'
                        disabled={!isValid || !dirty} 
                        type="submit"
                        content="Registruj se"    
                        style={{backgroundColor:'#48A6A7', color:'white'}}
                    />
                    
                </Form>
            )}
        </Formik>
    </Segment>

    </div>
    
    
  )
}
