
import express, { Request, Response } from 'express';
import Razorpay from 'razorpay';
import Purchase from '../models/Purchase';
import pdf from 'pdfkit';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

router.post('/create-order', async (req: Request, res: Response) => {
    const { amount, currency, receipt } = req.body;

    try {
        const order = await razorpay.orders.create({ amount, currency, receipt });
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, purchaseDetails } = req.body;

    // @ts-ignore
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
        return res.status(400).json({ msg: 'Transaction not legit!' });
    }

    const { buyerName, buyerEmail, designerName, designerEmail, designTitle, price } = purchaseDetails;

    try {
        const contractId = uuidv4();
        const purchase = new Purchase({
            buyerName,
            buyerEmail,
            designerName,
            designerEmail,
            designTitle,
            price,
            contractId,
        });

        await purchase.save();

        const doc = new pdf();
        const contractPath = `./Contract-${contractId}.pdf`;
        doc.pipe(require('fs').createWriteStream(contractPath));

        doc.fontSize(25).text('Contract of Purchase', { align: 'center' });
        doc.fontSize(16).text(`Contract ID: ${contractId}`);
        doc.text(`Purchase Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();
        doc.text(`Buyer: ${buyerName} (${buyerEmail})`);
        doc.text(`Designer: ${designerName} (${designerEmail})`);
        doc.moveDown();
        doc.text(`Design: ${designTitle}`);
        doc.text(`Price: $${price}`);
        doc.end();

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: buyerEmail,
            subject: 'Your Design Purchase Contract',
            text: `Hi ${buyerName}, thank you for your purchase. Please find your contract attached.`,
            attachments: [
                {
                    filename: `Contract-${contractId}.pdf`,
                    path: contractPath,
                    contentType: 'application/pdf',
                },
            ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email sent: ' + info.response);
        });

        res.json({
            msg: 'Payment successful',
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;

