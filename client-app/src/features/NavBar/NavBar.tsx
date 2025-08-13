import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MenuItem, Menu, Button, Modal, Tab, Dropdown, Image, Icon } from 'semantic-ui-react'
import LoginForm from '../LoginRegister/LoginForm'
import RegisterForm from '../LoginRegister/RegisterForm'
import { useStore } from '../../stores/store'

export default function NavBar() {
    const [active, setActive] = useState<string>("Pocetna stranica")
    const [modalOpen, setModalOpen] = useState(false)

    const handleClick = (name: string) => setActive(name)
    const handleAuthClick = () => setModalOpen(true)
    const closeModal = () => setModalOpen(false)
    const {userStore} = useStore();
    const {curentUser} = userStore;

    const panes = [
        {
            menuItem: 'Prijavi se',
            render: () => (
                <Tab.Pane>
                    <LoginForm  />
                </Tab.Pane>
            )
        },
        {
            menuItem: 'Registruj se',
            render: () => (
                <Tab.Pane>
                    <RegisterForm  />
                </Tab.Pane>
            )
        }
    ]

    return (
        <>
            <Menu tabular>
                <MenuItem
                    as={NavLink} to='/'
                    name='Pocetna stranica'
                    active={active === 'Pocetna stranica'}
                    onClick={() => handleClick('Pocetna stranica')}
                />
                <MenuItem
                    name='Isplaniraj odmor'
                    as={NavLink} to='/isplanirajOdmor'
                    active={active === 'Isplaniraj odmor'}
                    onClick={() => handleClick('Isplaniraj odmor')}
                />
                <MenuItem
                as={NavLink} to='/info'
                    name='Info'
                    active={active === 'Info'}
                    onClick={() => handleClick('Info')}
                />
                {curentUser?.uloga === "{psetilac}" &&
                <MenuItem
                    as={NavLink} to='/preporuke'
                    name='Preporuke'
                    active={active === 'Preporuke'}
                    onClick={() => handleClick('Preporuke')}
                />
                }
                {curentUser?.uloga === "RadnikNaSkijalistu" &&
                <MenuItem
                    as={NavLink} to='/kreiraj'
                    name='Kreiraj'
                    active={active === 'Kreiraj'}
                    onClick={() => handleClick('Kreiraj')}
                />
                }
                {!curentUser ? (
        <Menu.Item position='right'>
            <Button primary onClick={handleAuthClick}>
                Prijava / Registracija
            </Button>
        </Menu.Item>
    ) : (
        <Menu.Item position='right'>
        <Dropdown 
            trigger={
                <span>
                    <Icon  name='user circle' size='large' />
                    {curentUser.username}
                </span>
            }
        >
            <Dropdown.Menu>
                <Dropdown.Item 
                    text='Odjavi se' 
                    onClick={userStore.logout} 
                />
            </Dropdown.Menu>
        </Dropdown>
        </Menu.Item>
    )}
                
            </Menu>

            <Modal open={modalOpen} onClose={closeModal} size='small'>
                <Modal.Header>Dobrodošli</Modal.Header>
                <Modal.Content>
                    <Tab panes={panes} />
                </Modal.Content>
            </Modal>
        </>
    )
}
