import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MenuItem, Menu } from 'semantic-ui-react'

export default function NavBar() {
    const [active,setActive] = useState<string>("Pocetna stranica")
    const handleClick = (name:string) => setActive(name)
  return (
    <Menu tabular>
        <MenuItem
          as={NavLink} to='/'
          name='Pocetna stranica'
          active={active === 'Pocetna stranica'}
          onClick={()=>handleClick('Pocetna stranica')}
        />
        <MenuItem
          name='Isplaniraj odmor'
          as={NavLink} to='/isplanirajOdmor'
          active={active === 'Isplaniraj odmor'}
          onClick={()=>handleClick('Isplaniraj odmor')}
        />
        <MenuItem
          as={NavLink} to='/kreiraj'
          name='Kreiraj'
          active={active === 'Kreiraj'}
          onClick={()=>handleClick('Kreiraj')}
        />
      </Menu>
  )
}
