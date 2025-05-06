export const generateActivationKey = (imei) => {
    // Hash the IMEI to a base-36 string
    const base36Hash = (input) => {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            hash = (hash * 33 + input.charCodeAt(i)) >>> 0;
        }
        return hash.toString(36).toUpperCase();
    };

    // Generate a random alphanumeric string
    const randomAlphanumeric = (length) => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    // Format string with dashes every 4 characters
    const formatWithDashes = (input) => input.match(/.{1,4}/g).join("-");

    const part1 = base36Hash(imei).padStart(8, "0").slice(0, 8);
    const part2 = randomAlphanumeric(8);
    const rawKey = (part1 + part2).slice(0, 16);
    const key = formatWithDashes(rawKey);

    return key;
};
