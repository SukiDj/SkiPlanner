import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Header, InputOnChangeData } from "semantic-ui-react";
import { RedisSkiResort } from "../../../modules/RedisSkiResort";



interface SkiResortEditModalProps {
  open: boolean;
  onClose: () => void;
  resort: RedisSkiResort | null;
  onSave: (updated: RedisSkiResort) => void;
}

const SkiResortEditModal: React.FC<SkiResortEditModalProps> = ({
  open,
  onClose,
  resort,
  onSave,
}) => {
  const [formData, setFormData] = useState<RedisSkiResort | null>(resort);

  useEffect(() => {
    setFormData(resort);
  }, [resort]);

  const handleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => {
    if (!formData) return;
    const { name, value } = data;
    setFormData({
      ...formData,
      [name]: name === "ime" ? value : Number(value),
    });
  };

  const handleSubmit = () => {
    if (formData) {
      onSave(formData);
    }
  };

  if (!formData) return null;

  return (
    <Modal open={open} onClose={onClose} size="small" closeIcon>
      <Header icon="edit" content={`Izmena skijališta: ${formData.ime}`} />
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Input
            label="Ime skijališta"
            name="ime"
            value={formData.ime}
            onChange={handleChange}
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
        <Button onClick={onClose}>Otkaži</Button>
        <Button
          positive
          icon="checkmark"
          labelPosition="right"
          content="Sačuvaj izmene"
          onClick={handleSubmit}
        />
      </Modal.Actions>
    </Modal>
  );
};

export default SkiResortEditModal;
