export const updateCityDetails = (
    setFieldValue: (field: string, value: any) => void,
    targetItem: any,
    mappings: { [key: string]: string }
) => {
    Object.entries(mappings).forEach(([sourceKey, targetKey]) => {
        if (targetItem[sourceKey] !== undefined) {
            setFieldValue(targetKey, targetItem[sourceKey]);
        }
    });
};
