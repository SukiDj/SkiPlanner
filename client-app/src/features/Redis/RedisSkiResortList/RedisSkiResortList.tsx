import React, { useEffect, useState } from "react";
import { Card, Icon, Button } from "semantic-ui-react";
import { useStore } from "../../../stores/store";
import { observer } from "mobx-react-lite";
import SkiResortEditModal from "../SkiResortFormModal/SkiResortEditModal";
import { RedisSkiResort } from "../../../modules/RedisSkiResort";
import { s } from "motion/react-client";



const SkiResortList = () => {

    const {redisSkiResort} = useStore();
    const {getAllResorts, loadAllResorts, updateSkiResort,deleteSkiResort} = redisSkiResort;
    const [selectedResort, setSelectedResort] = useState<RedisSkiResort | null>(null);
    
  const [editOpen, setEditOpen] = useState<boolean>(false);

    const onEdit = (resort :RedisSkiResort) =>{
        setEditOpen(true);
        setSelectedResort(resort);
    }

    const handleSave = (updated: RedisSkiResort) => {
        updateSkiResort(updated).then(()=>{
            loadAllResorts();
            setEditOpen(false);
        })
  };

    const onDelete = (ime:string) =>{
        deleteSkiResort(ime).then(() => {
            loadAllResorts();
        })
    }
    useEffect(()=>{
        loadAllResorts();
    },[])

      

  
  
  return (
    <>
    <Card.Group itemsPerRow={3} stackable style={{ marginTop: "2em" }}>
      {getAllResorts.map((resort) => (
        <Card  color="blue" raised>
          <Card.Content>
            <Card.Header>{resort.ime}</Card.Header>
            <Card.Meta>
              <Icon name="users" /> {resort.brojSkijasa} skijaša
            </Card.Meta>
            <Card.Description>
              <p>
                <Icon name="road" color="green" /> Otvorenih staza:{" "}
                {resort.otvorenihStaza}
              </p>
              <p>
                <Icon name="road" color="red" /> Zatvorenih staza:{" "}
                {resort.zatvorenihStaza}
              </p>
              <p>
                <Icon name="car" /> Slobodnih parking mesta:{" "}
                {resort.slobodnihParkingMesta}
              </p>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
              <Button
                icon="edit"
                color="blue"
                size="tiny"
                content="Uredi"
                onClick={() => onEdit(resort)}
              />
              <Button
                icon="trash"
                color="red"
                size="tiny"
                content="Obriši"
                onClick={() => onDelete(resort.ime)}
              />
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
    <SkiResortEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        resort={selectedResort}
        onSave={handleSave}
      />
      </>
    
  );
};

export default observer(SkiResortList);
