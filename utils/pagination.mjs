const pagination = (total, page, limit) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPages = Math.ceil(total / limit);
  
    return {
      page,
      limit,
      total,
      totalPages,
      startIndex,
      endIndex,
    };
  };
  
  export default pagination;