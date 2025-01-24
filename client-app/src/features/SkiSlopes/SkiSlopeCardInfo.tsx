import { Card, CardContent, CardDescription, CardHeader, CardMeta } from "semantic-ui-react";
import { SkiSlope } from "../../modules/SkiSlope";
import { observer } from "mobx-react-lite";

interface SkiSlopeCardInfoProps {
    index : number;
    skiSlope: SkiSlope;
  }

function SkiSlopeCardInfo({index, skiSlope}:SkiSlopeCardInfoProps) {
  return (
    <Card>
        <CardContent index={index}>
        <CardHeader>{skiSlope.naziv}</CardHeader>
        <CardMeta>{skiSlope.duzina}</CardMeta>
        <CardDescription>
            Matthew is a pianist living in Nashville.
        </CardDescription>
        </CardContent>
    </Card>
  )
}
export default observer(SkiSlopeCardInfo);