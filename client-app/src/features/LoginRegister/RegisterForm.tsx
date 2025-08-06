import { Form, Formik } from 'formik';
import { Button, Icon, Segment } from 'semantic-ui-react';
import * as Yup from 'yup';
import TextInput from '../../common/TextInput';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../stores/store';

export default function RegisterForm() {

    const navigate = useNavigate();

    const validationSchema = Yup.object({
        ime : Yup.string().required("Unesite ime"),
        prezime : Yup.string().required("Unesite prezime"),
        email : Yup.string().required("Unesite email"),
        password : Yup.string().required("Unesite lozinku")
    })

    const {userStore} = useStore();
    const {registerUser} = userStore;
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
                id: '',
                ime : '',
                prezime: '',
                email: '',
                telefon: '',
                username: '',
                password: '',
                uloga: 'Posetilac'
            }}
            validationSchema={validationSchema}
            onSubmit={(values)=>registerUser(values)}
        >
            {({handleSubmit,isValid, dirty})=>(
                <Form className='ui form' onSubmit={handleSubmit}>
                    <TextInput name="ime" placeholder='Ime'/>
                    <TextInput name="prezime" placeholder='Prezime'/>
                    <TextInput name="telefon" placeholder='Telefon'/>
                    <TextInput name="email" placeholder='Email'/>
                    <TextInput name="username" placeholder='Korisnicko ime'/>
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
