import { Button, Card, CardContent, CardDescription, CardHeader, CardMeta, Modal } from "semantic-ui-react";
import { SkiSlope } from "../../modules/SkiSlope";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import SkiSlopeForm from "../CreatePage/Forms/SkiSlopeForm";
import { v4 as uuid } from 'uuid';

interface SkiSlopeCardInfoProps {
    index : number;
    skiSlope: SkiSlope;
  }

function SkiSlopeCardInfo({index, skiSlope}:SkiSlopeCardInfoProps) {
  const { skiSlopeStore, userStore } = useStore();
  const { setSelectedSlope, openForm, update, closeForm, deleteSkiSlope, selectedSlope } = skiSlopeStore;
  const {isEmploye} = userStore;

  const handleSlopeSubmit = async (slope: SkiSlope) => {
    await update(slope.id, slope);
  closeForm();  
};
console.log(selectedSlope)
  return (
    <>
      <Card raised color="blue">
        <CardContent>
          <CardHeader style={{ fontSize: "1.4em", marginBottom: "0.3em" }}>
            🏔️ {skiSlope.naziv}
          </CardHeader>
          
          <CardDescription style={{ marginTop: "0.5em", lineHeight: "1.5em" }}>
            <div><strong>Dužina:</strong> {skiSlope.duzina} m</div>
            <div><strong>Težina:</strong> {skiSlope.tezina}</div>
          </CardDescription>

          {isEmploye && (
            <div style={{ marginTop: "1em" }}>
              <Button
                size="small"
                color="blue"
                onClick={() => {
                  setSelectedSlope(skiSlope);
                  openForm();
                }}
              >
                Izmeni
              </Button>
              <Button
                size="small"
                color="red"
                content="Obriši"
                onClick={() => deleteSkiSlope(skiSlope)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {skiSlopeStore.editMode && (
        <Modal
          open={skiSlopeStore.editMode}
          onClose={skiSlopeStore.closeForm}
          size="small"
          dimmer="blurring"
        >
           <Modal.Header>Izmeni Hotel</Modal.Header>
          <Modal.Content>
            {selectedSlope && (
              <SkiSlopeForm
              initialSkiSlope={selectedSlope}
              onFormSubmit={handleSlopeSubmit}
            />
            )}
            
          </Modal.Content>
        </Modal>
      )}
    </>
  )
}
export default observer(SkiSlopeCardInfo);