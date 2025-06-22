import QRCode from 'qrcode'
const generateQRCode = async (_id, options = {}) => {
    try{
        const url = `${import.meta.env.VITE_FRONTEND_URL}/plant/${_id}`
        const qrCode = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            ...options,
        })
        return qrCode
    }
    catch(error) {
        throw error
    }
}
export default generateQRCode