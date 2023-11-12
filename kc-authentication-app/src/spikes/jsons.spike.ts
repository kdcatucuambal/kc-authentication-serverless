import {AuthLoginRq} from "../models/auth-login.model";
import {logger} from "./logger.spike";

class A {
    a: string;
    b: string;
}

const main = async () => {

    const json = {
        "name": "John",
        "age": 31,
        "city": "New York"
    }

    const txt = "Hello world";
    const rq:AuthLoginRq = {
        authentication: {
            login: "login",
            password: "password"
        }
    }

    const a = new A();
    a.a = "a";
    a.b = "b";

    console.log(JSON.stringify(json));
    console.log(JSON.stringify(txt));
    console.log(JSON.stringify(rq));
    console.log(JSON.stringify(a));


    const log = "Class created: " + a;
    logger.info(log);

}


main().then();
