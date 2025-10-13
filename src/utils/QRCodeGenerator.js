import QRCode from 'qrcode'
const generateQRCode = async (_id, QRCodeType, options = {}) => {
    try{
        const url = QRCodeType === 'Garden' ?
            `${import.meta.env.VITE_FRONTEND_URL}/garden/${_id}` : 
            `${import.meta.env.VITE_FRONTEND_URL}/plant/${_id}`
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