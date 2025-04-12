export const friendlyUrl = (str: string): string => {
    return str
        .toLowerCase()
        .trim()
        .normalize("NFD") // remove accents
        .replace(/[\u0300-\u036f]/g, "") // remove diacritics
        .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumerics with dashes
        .replace(/^-+|-+$/g, "") // trim leading/trailing dashes
        .replace(/--+/g, "-"); // replace multiple dashes with a single dash
};
