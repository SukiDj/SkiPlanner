import React from 'react'
import { Button, Checkbox, Container, Dropdown, Input, ItemGroup } from 'semantic-ui-react'

export default function SkiSlopeForm() {
    const options = [
        { key: 'kopaonik', text: 'Kopaonik', value: 'kopaonik' },
        { key: 'zlatibor', text: 'Zlatibor', value: 'zlatibor' }
      ]
  return (
    <Container style={{marginTop:'5em', backgroundColor: '#F4F9FA', borderRadius:'5em'}}>
        <h1>Kreiraj Ski Stazu</h1>
        
        <ItemGroup style={{marginTop:'5em'}}>
            <Input placeholder='Ime' style={{marginRight:'3em'}}/>
            <Dropdown placeholder='Skijalista' style={{marginRight:'3em'}}  selection options={options} />
            <Input
            label={{ basic: true, content: 'm' }}
            labelPosition='right'
            placeholder='Duzina staze...'
            />
        </ItemGroup>
        
        <ItemGroup>
            <Checkbox label='Plava' style={{fontSize:'20px', marginRight:'3em'}}/>
            <Checkbox label='Zelena' style={{fontSize:'20px', marginRight:'3em'}}/>
            <Checkbox label='Crvena' style={{fontSize:'20px', marginRight:'3em'}}/>
            <Checkbox label='Crna' style={{fontSize:'20px'}}/>
        </ItemGroup>

        <Button>Kreiraj</Button>
        
        
    </Container>
  )
}
