import NodeGeocoder from 'node-geocoder'
import Env from '@ioc:Adonis/Core/Env'


const options = {
    provider: 'google',

    // Optional depending on the providers
    apiKey: Env.get('MAP_API_KEY'), // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

class GeoService {
    private readonly geocoder: NodeGeocoder;

    constructor() {
        this.geocoder = NodeGeocoder(options);
    }

    async coordinateToStreet(lat: number, lng: number): Promise<any> {
        const address = await this.geocoder.reverse({
            lat, lon: lng
        })
        return address[0]['formattedAddress']
    }

    async coordinateToShortAddress(lat: number, lng: number): Promise<any> {
        const address = await this.geocoder.reverse({
            lat, lon: lng
        })
        // console.log(`address:${JSON.stringify(address, null, 4)}`)
        return address[0]['city'] + ", " + address[0]['country']
    }
}

export default new GeoService();
