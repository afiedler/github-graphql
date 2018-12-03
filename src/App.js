import React, { Component } from "react";
import { Query } from "react-apollo";
import "./App.css";
import { trendingRepositoriesGQLQuery } from "./data/query";
import moment from "moment";
import MyComponent from "./components/MyComponent";

class App extends Component {
  render() {
    const date = new moment(new Date()).subtract(1, "weeks");
    const formattedDate = date.format("YYYY-MM-DD");
    const query = `created:>${formattedDate} sort:stars-desc`;
    return (
      <div>
        <h1>Last Week Trending Repositories</h1>
        <Query
          notifyOnNetworkStatusChange={true}
          query={trendingRepositoriesGQLQuery}
          variables={{
            query
          }}
        >
          {({ data, loading, error, fetchMore }) => {
            if (error) return <p>{error.message}</p>;
            const search = data.search || { pageInfo: { hasNextPage: false }, edges: [] };

            return (<MyComponent hasNextPage={search.pageInfo.hasNextPage} list={search.edges} isNextPageLoading={loading}
              loadNextPage={() =>
                fetchMore({
                  variables: {
                    query,
                    cursor: search.pageInfo.endCursor
                  },
                  updateQuery: (prevResult, { fetchMoreResult }) => {
                    const newEdges = fetchMoreResult.search.edges;
                    const pageInfo = fetchMoreResult.search.pageInfo;
                    return newEdges.length
                      ? {
                        search: {
                          __typename: prevResult.search.__typename,
                          edges: [...prevResult.search.edges, ...newEdges],
                          pageInfo
                        }
                      }
                      : prevResult;
                  }
                })} />)
          }}
        </Query>
      </div>
    );
  }
}

export default App;
