import { Appbar, AppbarActionProps } from "react-native-paper"
import { getHeaderTitle } from "@react-navigation/elements"
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

type AppHeaderProps = NativeStackHeaderProps & {
    actions?: AppbarActionProps[];
};

export const AppHeader = ({navigation, route, options, back, actions}: AppHeaderProps) => {
    const title = getHeaderTitle(options, route.name);

    return (
        <Appbar.Header>
            {back &&<Appbar.BackAction onPress={navigation.goBack} />}
            <Appbar.Content title={title} />
            {actions && actions.map((props, index) => <Appbar.Action key={index} {...props} />)}
        </Appbar.Header>
    )
}