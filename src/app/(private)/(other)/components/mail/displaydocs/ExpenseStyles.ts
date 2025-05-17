import { StyleSheet } from '@react-pdf/renderer';

export const expenseStyles = StyleSheet.create({
    page: {
        padding: 30,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2F2F2F',
        marginBottom: 20,
        textAlign: 'center',
    },
    total: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 20,
        textAlign: 'left',
        padding: '8px 0',
        borderBottom: '1px solid #DFDFDF',
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#DFDFDF',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#DFDFDF',
        minHeight: 30,
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#F2FBFA',
        fontWeight: 'bold',
    },
    cell: {
        flex: 1,
        padding: 8,
        fontSize: 12,
        textAlign: 'left',
        borderRightWidth: 1,
        borderRightColor: '#DFDFDF',
    },
    paymentTypeCell: {
        flex: 0.75, // 25% smaller than other cells
        padding: 8,
        fontSize: 12,
        textAlign: 'left',
        borderRightWidth: 1,
        borderRightColor: '#DFDFDF',
    },
    companyCell: {
        flex: 1.25, // Extra space from payment type
        padding: 8,
        fontSize: 12,
        textAlign: 'left',
        borderRightWidth: 1,
        borderRightColor: '#DFDFDF',
    },
    firstCell: {
        textAlign: 'left',
    }
});
