import { Form, Formik } from "formik";
import { Button, Icon, Segment } from "semantic-ui-react";
import * as Yup from 'yup';
import TextInput from "../../common/TextInput";
import { UserLoginForm } from "../../modules/UserLoginForm";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../stores/store";
import { observer } from "mobx-react-lite";


const LoginForm = () => {

    const navigate = useNavigate();
    const {userStore} = useStore();
    const {loginUser, curentUser, loadingRegLog} = userStore;

    const validationScheme = Yup.object({
        email : Yup.string().required("Unesite email"),
        password : Yup.string().required("Unesite lozinku")
    })
    const handleSubmit=(values:UserLoginForm)=>{
        loginUser(values);
    }
    console.log(curentUser)
  return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
    }}>
        <Segment color='green' style={{width: "500px",
          padding: "3rem", 
          borderRadius: "10px", 
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"}}>
                <Formik 
                    initialValues={{email : '', password: ''}}
                    validationSchema={validationScheme}
                    onSubmit={(values)=>handleSubmit(values)}
                >
                {({handleSubmit, isValid, dirty})=>(
                    <Form className="ui form" onSubmit={handleSubmit}>
                        <TextInput name="email" placeholder="Email" />
                        <TextInput name="password" placeholder="Lozinka" />
                        <Button
                            className="right floated"
                            disabled={!isValid || !dirty}
                            positive
                            type="submit"
                            content="Prijavi se"
                            loading={loadingRegLog}
                        />
                       
                    </Form>
                )}
                </Formik>

        
    </Segment>
    </div>
    
  )
}
export default observer(LoginForm)