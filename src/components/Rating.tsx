import { StyleProp, Text, TextStyle } from "react-native";

type RatingProps = {
    rating : number;
    showNumber?: boolean;
    style?: StyleProp<TextStyle>;
}
export const Rating = ({ rating, showNumber = false, style} : RatingProps) => {
    const roundedRating = Math.round(rating);
    const stars = "⭐".repeat(roundedRating);

    const numericRating = showNumber ? ` (${rating})` : '';
    return (
        <Text style={[{fontSize: 12}, style]}>{`${stars}${numericRating}`}</Text>
    );
}