import "dotenv/config";
import {app} from "./src/app";
import {logger} from "./src/middlewares/logger/config/logger";


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`${PORT}번 포트로 정상적으로 서버를 시작하였습니다. `);
});
//
