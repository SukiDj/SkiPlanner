import { Hotel } from "./Hotel";
import { Restaurant } from "./Restaurant";
import { SkiResort } from "./SkiResort";

export type VacationOptions = {
    id: string,
    skijaliste: SkiResort;
    hotel:      Hotel;
    restoran:   Restaurant;
    ukupnaCena: number;
}