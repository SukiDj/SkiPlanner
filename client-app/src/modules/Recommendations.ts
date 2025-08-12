import { Hotel } from "./Hotel";
import { Restaurant } from "./Restaurant";
import { SkiResort } from "./SkiResort";

export type Recommendation = {
    id: string,
    skijaliste: SkiResort;
    hoteli:      Hotel[];
    restorani:   Restaurant[];
}