import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";


function Members() {
    const [members, setMembers] = useState([]);
    const [filters, setFilters] = useState({
        firstName: "",
        lastName: "",
        hasGroup: "",
        groupId: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [userGroup, setUserGroup] = useState(null);
    const navigate = useNavigate();

    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:9002/current-user", {withCredentials: true});
            if(response.data.group) {
                setUserGroup(response.data.group);
            }
        } catch (error) {
            console.log("Błąd pobierania danych użytkownika");
        }
    }, []);

    const fetchMembers =  useCallback(async (page = 0) => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                ...filters,
                page,
                size: 10,
            };
            const response = await axios.get("http://localhost:9002/members", {
                params,
                withCredentials: true,
            });

            console.log(response.data);

            setMembers(response.data.content);
            setCurrentPage(response.data.pageable.pageNumber);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            setError("Nie udało się pobrać użystkowników.");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchUserData()
        fetchMembers();
    }, [filters, fetchUserData, fetchMembers]);

    const handleFilterChange = (e) => {
        const {name, value} = e.target;
        setFilters({...filters, [name]: value});
    };

    const handlePageChange = (page) => {
        if(page >= 0 && page < totalPages) {
            fetchMembers(page);
        }
    };


    const assignToGroup = async (memberId) => {
        if(!userGroup) {
            navigate("/create-group");
        } else {
            try {
                console.log(userGroup.id);
                await axios.patch(`http://localhost:9002/members/${memberId}/assign`,
                    userGroup.id,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                alert("Użytkownik został przypisany do twojej róży.");
                fetchMembers(currentPage);
            } catch (error) {
                alert("Nie udało się przypisać użytkownika.");
            }
        }
    };


    return (
        <div>
            <h1>Lista użytkowników</h1>
            <form>
                <label>
                    Imię:
                    <input
                        type="text"
                        name="firstName"
                        value={filters.firstName}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>
                    Nazwisko:
                    <input
                        type="text"
                        name="lastName"
                        value={filters.lastName}
                        onChange={handleFilterChange}
                    />
                </label>
                <label>
                    Ma grupę?
                    <select
                        name="hasGroup"
                        value={filters.hasGroup}
                        onChange={handleFilterChange}
                    >
                        <option value="">Wszyscy</option>
                        <option value="true">Tak</option>
                        <option value="false">Nie</option>
                    </select>
                </label>
                <label>
                    Grupa:
                    <input
                        type="text"
                        name="groupId"
                        value={filters.groupId}
                        onChange={handleFilterChange}
                    />
                </label>
                <button
                    type="button"
                    onClick={() => fetchMembers(1)}
                >
                    Filtruj
                </button>
            </form>

            {loading? (
                <p>Ładowanie...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Imię</th>
                                <th>Nazwisko</th>
                                <th>Email</th>
                                <th>Róża</th>
                                <th>Akcja</th>
                            </tr>
                        </thead>
                        <tbody>
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td>{member.firstName}</td>
                                <td>{member.lastName}</td>
                                <td>{member.email}</td>
                                <td>{member.group ? member.group.name : "Brak przypisania do róży"}</td>
                                <td>
                                    {!member.group ? (
                                        <button onClick={() => assignToGroup(member.id)}>
                                            Przypisz do mojej róży
                                        </button>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div>
                        <button onClick={() => handlePageChange(currentPage - 1)}>Poprzednia</button>
                        <span>
                            Strona {currentPage + 1} z {totalPages}
                        </span>
                        <button onClick={() => handlePageChange(currentPage + 1)}>Następna</button>
                    </div>
                </>
            )}
        </div>
    );

}

export default Members;