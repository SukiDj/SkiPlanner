import React from 'react'
import { Card, CardContent, CardDescription, CardGroup, CardHeader, CardMeta, Container } from 'semantic-ui-react'
import SkiSlopeCardInfo from './SkiSlopeCardInfo'
import { useStore } from '../../stores/store'
import { observer } from 'mobx-react-lite';

function SkiSlopesInfo() {
    const {skiSlopeStore} = useStore();
    const {getGreenSkiSlopes,getBlackSkiSlopes,getBlueSkiSlopes,getRedSkiSlopes} = skiSlopeStore;
    const {numberOfBlackSSlopes,numberOfBlueSSlopes,numberOfGreenSSlopes,numberOfRedSSlopes} = skiSlopeStore;
  return (
    <>
        { numberOfRedSSlopes !==0 &&
            <>
                <h1>
                    Crvene Staze
                </h1>
                <CardGroup centered>
            {
                getRedSkiSlopes.map((skiSlope,index) => (
                    <SkiSlopeCardInfo key={skiSlope.id} index={index} skiSlope={skiSlope} />
                ))
            } 
            </CardGroup>
            </>
            
        },
        {numberOfBlueSSlopes !==0 &&
            <>
                <h1>
                    Plave Staze
                </h1>
                <CardGroup centered>
                {
                    getBlueSkiSlopes.map((skiSlope,index) => (
                        <SkiSlopeCardInfo key={skiSlope.id} index={index} skiSlope={skiSlope} />
                    ))
                } 
                </CardGroup>
            </>
        },
        {numberOfGreenSSlopes!==0 &&
            
            <>
                <h1>
                    Zelene Staze
                </h1>
                <CardGroup centered>
                {
                    getGreenSkiSlopes.map((skiSlope,index) => (
                        <SkiSlopeCardInfo key={skiSlope.id} index={index} skiSlope={skiSlope} />
                    ))
                } 
                </CardGroup>
            </>
        },
        {numberOfBlackSSlopes !==0 &&
            <>
                <h1>
                    Crne Staze
                </h1>
                <CardGroup centered>
                {
                    getBlackSkiSlopes.map((skiSlope,index) => (
                        <SkiSlopeCardInfo key={skiSlope.id} index={index} skiSlope={skiSlope} />
                    ))
                } 
                </CardGroup>
            </>
        }
        
        
        
        
    </>
    
  
  )
}
export default observer(SkiSlopesInfo);