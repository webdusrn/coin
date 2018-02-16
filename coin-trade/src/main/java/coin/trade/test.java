package coin.trade;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class test {

    @RequestMapping("/main")
    public String testAPI() {
        return "Welcome to coin-trade";
    }
}
