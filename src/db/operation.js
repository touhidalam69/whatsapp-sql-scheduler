const { sql, poolPromise } = require('../config/database');

const MESSAGE_STATUS = {
    PENDING: 0,
    SUCCESS: 1,
    FAILED_NOT_REGISTERED: 2
};

exports.readScheduleMessage = async () => {
    const pool = await poolPromise;
    const rs = await pool
        .request()
        .input('DeliveryStatus', sql.TinyInt, MESSAGE_STATUS.PENDING)
        .input('WorkHourStart', sql.Int, process.env.WORK_HOUR_START || 10)
        .input('WorkHourEnd', sql.Int, process.env.WORK_HOUR_END || 19)
        .query(`SELECT top 1 *
                FROM dbo.WP_MessgeSchedule 
                WHERE ScheduleDate <= getdate() 
                  AND DATEPART(HOUR, GETDATE()) BETWEEN @WorkHourStart AND @WorkHourEnd 
                  AND DeliveryStatus = @DeliveryStatus 
                ORDER BY ScheduleId DESC`);

    return rs.recordset;
}

exports.updateDeliveryStatus = async (ScheduleId, DeliveryStatus, Status) => {
    const pool = await poolPromise;
    const rs = await pool
        .request()
        .input('ScheduleId', sql.Int, ScheduleId)
        .input('DeliveryStatus', sql.TinyInt, DeliveryStatus)
        .input('Status', sql.NVarChar(1000), Status)
        .query(`UPDATE WP_MessgeSchedule 
                SET DeliveryStatus = @DeliveryStatus, 
                    DeliveryDate = GETDATE(), 
                    Status = @Status 
                WHERE ScheduleId = @ScheduleId`);

    return rs.rowsAffected;
}

exports.logIncomingMessage = async (whatsappNo, messageBody) => {
    const pool = await poolPromise;
    const rs = await pool
        .request()
        .input('WhatsappNo', sql.NVarChar(50), whatsappNo)
        .input('MessageBody', sql.NVarChar(sql.MAX), messageBody)
        .query(`INSERT INTO dbo.WP_IncomingMessages (WhatsappNo, MessageBody)
                VALUES (@WhatsappNo, @MessageBody)`);

    return rs.rowsAffected;
}

exports.MESSAGE_STATUS = MESSAGE_STATUS;