package no.autopacker.userservice.domain;

import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import no.autopacker.userservice.entity.User;

/**
 * Represents our token class which can hold information like the token itself, which user it
 * belongs to and expiry date. This is also a parent class inspired from:
 * https://www.baeldung.com/registration-verify-user-by-email
 */
@MappedSuperclass
@NoArgsConstructor
public abstract class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String tokenVal;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    private Date expiryDate;

    /**
     * Returns the expiration date of the token
     *
     * @return the expiration date of the token
     */
    private Date calculateExpiryDate() {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Timestamp(cal.getTime().getTime()));
        cal.add(Calendar.MINUTE, 60 * 24);
        return new Date(cal.getTime().getTime());
    }

    /**
     * Constructor for objects of class Token
     *
     * @param tokenVal the token itself
     */
    public Token(User user, String tokenVal) {
        this.user = user;
        this.tokenVal = tokenVal;
        setExpiryDate(calculateExpiryDate());
    }

    public String getTokenVal() {
        return tokenVal;
    }

    public void setTokenVal(String tokenVal) {
        this.tokenVal = tokenVal;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }
}
