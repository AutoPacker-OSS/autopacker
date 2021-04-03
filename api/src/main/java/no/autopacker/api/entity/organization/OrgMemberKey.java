package no.autopacker.api.entity.organization;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * This class describes a composite key for many-to-many relationship between Organization and User
 * Follows approach described in
 * https://vladmihalcea.com/the-best-way-to-map-a-many-to-many-association-with-extra-columns-when-using-jpa-and-hibernate/
 */
@Embeddable
public class OrgMemberKey implements Serializable {
    @Column(name = "user_id")
    private String userId;
    @Column(name = "organization_id")
    private Long organizationId;

    public OrgMemberKey(String userId, Long organizationId) {
        this.userId = userId;
        this.organizationId = organizationId;
    }

    public OrgMemberKey() {

    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;

        if (o == null || getClass() != o.getClass())
            return false;

        OrgMemberKey that = (OrgMemberKey) o;
        return Objects.equals(organizationId, that.organizationId) &&
                Objects.equals(userId, that.userId);
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, organizationId);
    }
}
