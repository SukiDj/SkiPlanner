import React, { useEffect, useState } from "react";
import { Card, Icon, Button, Label } from "semantic-ui-react";
import { useStore } from "../../../stores/store";
import { observer } from "mobx-react-lite";
import SkiResortEditModal from "../SkiResortFormModal/SkiResortEditModal";
import { RedisSkiResort } from "../../../modules/RedisSkiResort";
import { s } from "motion/react-client";



const SkiResortList = () => {

    const {redisSkiResort, userStore} = useStore();
    const {getAllResorts, loadAllResorts, updateSkiResort,deleteSkiResort, getAllSubbed, getAllSubbedSkiR, subscribe,unSubscribe,getSkiResortNames } = redisSkiResort;
    const {curentUser} = userStore;
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
    const loadData = async () => {
    await getAllSubbedSkiR(curentUser!.id); 
    await loadAllResorts();  
  };

    useEffect(()=>{
        loadData();
        getSkiResortNames();
    },[])

    const handleSubscribe =async (name:string) =>{
       await subscribe(curentUser!.id,name)
       await loadData();
    }
      
    const handleUnSubscribe = async (name:string) =>{
        await unSubscribe(curentUser!.id,name);
        await loadData();
    }
  
  
  return (
    <>
    <h3>Prijavljena skijalista</h3>
    <Card.Group itemsPerRow={3} stackable style={{ marginTop: "2em" }}>
      {getAllSubbed.map((resort) => (
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
                color="red"
                size="tiny"
                content="Ukini pretplatu"
                onClick={() => handleUnSubscribe(resort.ime)}
              />
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
    <h3>Neprijavljena skijalista</h3>
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
            {curentUser?.uloga=="RadnikNaSkijalistu" &&(
                <>
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
              </>
            )
            }
              {curentUser?.uloga=="Posetilac" &&(
              <Button
                color="red"
                size="tiny"
                content="Pretplati se"
                onClick={() => handleSubscribe(resort.ime)}
              />
              )}
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
