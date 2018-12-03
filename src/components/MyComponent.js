import * as React from "react";
import { InfiniteLoader, List } from "react-virtualized";
export default function MyComponent ({
    /** Are there more items to load? (This information comes from the most recent API request.) */
    hasNextPage,
    /** Are we currently loading a page of items? (This may be an in-flight flag in your Redux store for example.) */
    isNextPageLoading,
    /** List of items loaded so far */
    list,
    /** Callback function (eg. Redux action-creator) responsible for loading the next page of items */
    loadNextPage
  }) {
    // If there are more items to be loaded then add an extra row to hold a loading indicator.
    const rowCount = hasNextPage
      ? list.length + 1
      : list.length
  
    // Only load 1 page of items at a time.
    // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
    const loadMoreRows = isNextPageLoading
      ? () => {}
      : loadNextPage
  
    // Every row is loaded except for our loading indicator row.
    const isRowLoaded = ({ index }) => !hasNextPage || index < list.length
  
    // Render a list item or a loading indicator.
    const rowRenderer = ({ index, key, style }) => {
      let content
  
      if (!isRowLoaded({ index })) {
        content = 'Loading...'
      } else {
        content = list[index].node.name;
      }
  
      return (
        <div
          key={key}
          style={style}
        >
          {content}
        </div>
      )
    }
  
    return (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={rowCount}
      >
        {({ onRowsRendered, registerChild }) => (
          <List
            ref={registerChild}
            onRowsRendered={onRowsRendered}
            rowRenderer={rowRenderer}
            height={200}
            rowCount={rowCount}
            rowHeight={20}
            width={500}
          />
        )}
      </InfiniteLoader>
    )
  }