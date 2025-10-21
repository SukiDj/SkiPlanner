import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Header, InputOnChangeData, DropdownProps } from "semantic-ui-react";
import { RedisSkiResort } from "../../../modules/RedisSkiResort";
import { useStore } from "../../../stores/store";

const SkiResortFormModal: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { redisSkiResort, userStore } = useStore();
  const { createSkiResort, getSkiResortNames, getSkiResortOptions } = redisSkiResort;
  
  const [formData, setFormData] = useState<RedisSkiResort>({
    ime: "",
    slobodnihParkingMesta: 0,
    otvorenihStaza: 0,
    zatvorenihStaza: 0,
    brojSkijasa: 0,
  });
  const { curentUser } = userStore;

  const handleChange = (_: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    const { name, value } = data;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSelectChange = (_: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    setFormData((prev) => ({
      ...prev,
      ime: data.value as string,
    }));
  };

  const handleSubmit = () => {
    console.log("Podaci o novom skijalištu:", formData);
    createSkiResort(formData).then(() => {
      setOpen(false);
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2em" }}>
      {curentUser?.uloga === "RadnikNaSkijalistu" && (
        <Button primary onClick={() => setOpen(true)}>
          + Dodaj novo skijalište
        </Button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} size="small" closeIcon>
        <Header icon="snowflake" content="Kreiranje skijališta" />
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Dropdown
              label="Izaberi skijalište"
              placeholder="Odaberi skijalište"
              name="ime"
              selection
              options={getSkiResortOptions}
              value={formData.ime}
              onChange={handleSelectChange}
              required
            />

            <Form.Input
              label="Slobodnih parking mesta"
              type="number"
              name="slobodnihParkingMesta"
              value={formData.slobodnihParkingMesta}
              onChange={handleChange}
              min="0"
            />
            <Form.Input
              label="Otvorenih staza"
              type="number"
              name="otvorenihStaza"
              value={formData.otvorenihStaza}
              onChange={handleChange}
              min="0"
            />
            <Form.Input
              label="Zatvorenih staza"
              type="number"
              name="zatvorenihStaza"
              value={formData.zatvorenihStaza}
              onChange={handleChange}
              min="0"
            />
            <Form.Input
              label="Broj skijaša"
              type="number"
              name="brojSkijasa"
              value={formData.brojSkijasa}
              onChange={handleChange}
              min="0"
            />
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>Otkaži</Button>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="Kreiraj"
            onClick={handleSubmit}
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default SkiResortFormModal;
