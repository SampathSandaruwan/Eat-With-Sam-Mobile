export type PublicStackParams = {
    Restaurants: undefined;
    Menu: { restaurantId: number };
};

export type AuthenticatedStackParams = {
    Orders: undefined;
};

export type RootStackParams = PublicStackParams & AuthenticatedStackParams;

