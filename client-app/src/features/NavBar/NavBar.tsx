import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MenuItem, Menu, Button, Modal, Tab } from 'semantic-ui-react'
import LoginForm from '../LoginRegister/LoginForm'
import RegisterForm from '../LoginRegister/RegisterForm'

export default function NavBar() {
    const [active, setActive] = useState<string>("Pocetna stranica")
    const [modalOpen, setModalOpen] = useState(false)

    const handleClick = (name: string) => setActive(name)
    const handleAuthClick = () => setModalOpen(true)
    const closeModal = () => setModalOpen(false)

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
                    as={NavLink} to='/kreiraj'
                    name='Kreiraj'
                    active={active === 'Kreiraj'}
                    onClick={() => handleClick('Kreiraj')}
                />

                <Menu.Menu position='right'>
                    <MenuItem>
                        <Button primary onClick={handleAuthClick}>
                            Prijava / Registracija
                        </Button>
                    </MenuItem>
                </Menu.Menu>
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
