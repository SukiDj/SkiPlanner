import { Card, CardContent, CardDescription, CardHeader, CardMeta } from "semantic-ui-react";
import { SkiSlope } from "../../modules/SkiSlope";

interface SkiSlopeCardInfoProps {
    index : number;
    skiSlope: SkiSlope;
  }

export default function SkiSlopeCardInfo({index, skiSlope}:SkiSlopeCardInfoProps) {
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
